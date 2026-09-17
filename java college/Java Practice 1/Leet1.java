import java.util.Scanner;
class Leet1{
     public static void main(String []args){
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int[] arr=new int[n];
        for(int i=1;i<=arr[n];i++)
        arr[i]=sc.nextInt();
        for(int i=1;i<=arr.length*2;i++)
        System.out.println(arr[i]);
     }
}