public class LinkList {
    public static void main(String[] args) {
        LinkList list=new LinkList();
        list.InsertFirst(5);
        list.InsertFirst(8);
        list.InsertFirst(1);
        list.InsertLast(15);
        list.InsertLast(22);
        list.Insert(9,3);
        list.Insert(50,3);
        list.Display();
        System.out.println(list.DeleteLastt());
        list.Display();
        System.out.println(list.Delete(3));
        list.Display();
        System.out.println(list.find(15));
    }
    
Node head;
Node tail;
class Node{
    int val;
    Node next;
    public Node(int val){
        this.val=val;
    }
    public Node(int val,Node next){
        this.val=val;
        this.next=next;
    }
}
int size=0;

public Node find(int val){
    Node temp=head;
    while(temp!=null){
        if(temp.val == val){
            return temp;
        }
        temp=temp.next;
    }
    return null;
}

public Node get(int index){
    Node temp=head;
    for(int i=0;i<index;i++){
        temp=temp.next;
    }
    return temp;
}

public void InsertFirst(int val){
    Node node=new Node(val);
    node.next=head;
    head=node;
    if(tail==null){
        tail=head;
    }
    size++;
}
public void InsertLast(int val){
    if(tail==null){
        InsertFirst(val);
        return;
    }
    Node node=new Node(val);
    tail.next=node;
    tail=node;
    size++;
}
public void Insert(int val,int index){
    if(index==0){
        InsertFirst(val);
        return;
    }
    if(index==size){
        InsertLast(val);
        return;
    }
    Node temp=head;
    for(int i=1;i<index;i++){
        temp=temp.next;
    }
    Node node=new Node(val,temp.next);
    temp.next=node;
    size++;

}
//if dont want to return deleted val then use void and dont save val
public int DeleteFirst(){//if want to return the value tht was deleted use int
    int val=head.val;//and this statement
    head=head.next;
    if(head==null){
        tail=null;
    }
   size--;
   return val;//and this
}

//if dont want to return deleted val then use void and dont save val
public int DeleteLastt(){//if want to return the value tht was deleted use int
    if(size<=1){
        return DeleteFirst();
    }
    Node secondLast= get(size-2);
    int val=tail.val;//and this statement
    tail=secondLast;
    tail.next=null;    
    size--;
   return val;//and this
}

public int Delete(int index){
    Node prev=get(index-1);
    int val=prev.next.val;
    prev.next=prev.next.next;
    return val;
}

public void Display(){
    Node temp=head;
    while(temp!=null){
        System.out.print(temp.val+" -> ");
        temp=temp.next;
    }
    System.out.println("End");
}

}