import java.util.Scanner;
public class Passandfail {
    public static void main(String[] args) {
    int n,count=0,target,fail=0;
    Scanner sc=new Scanner(System.in);
    n=sc.nextInt();
    boolean exists=true;
    int[] arr=new int[n];
    for(int i=0;i<n;i++){
        arr[i]=sc.nextInt();
    }
    target=sc.nextInt();

    for(int i=0;i<n;i++){
    if(target>=arr[i]){
        count++;
    }
    else{
        fail++;
    }
    }
    System.out.println("Pass: "+count);
    System.out.println("Fail: "+fail);
}}
